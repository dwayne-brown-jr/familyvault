import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  demoDebts,
  demoNetWorthSnapshots,
  demoBudgetCategories,
  demoExpenses,
  demoContacts,
  demoLegalDocuments,
  demoFinancialAccounts,
  demoInsurancePolicies,
  demoMonthlyBills,
  demoDigitalAccess,
  demoActionItems,
} from "@/lib/demo-data";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Row = Record<string, any>;

// Demo rows carry placeholder ids/owners that must not reach the database.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const strip = (items: any[]): Row[] =>
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  items.map(({ id, user_id, created_at, ...rest }) => rest as Row);

const SEED_TABLES: Record<string, () => Row[]> = {
  debts: () => strip(demoDebts),
  net_worth_snapshots: () => strip(demoNetWorthSnapshots),
  budget_categories: () => strip(demoBudgetCategories),
  contacts: () => strip(demoContacts),
  legal_documents: () => strip(demoLegalDocuments),
  financial_accounts: () => strip(demoFinancialAccounts),
  insurance_policies: () => strip(demoInsurancePolicies),
  monthly_bills: () => strip(demoMonthlyBills),
  digital_access: () => strip(demoDigitalAccess),
  action_items: () => strip(demoActionItems),
  // Demo category_ids reference budget_categories that don't exist here.
  expenses: () => strip(demoExpenses).map((e) => ({ ...e, category_id: null })),
  letter_of_intent: () => [{ content: "", last_updated: new Date().toISOString() }],
};

/**
 * Seeds starter data for the caller's household.
 *
 * Body (optional): { tables: string[] } — defaults to every table.
 * Tables that already hold rows for the household are skipped, so this is safe
 * to call more than once.
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Every data table's RLS policy is `household_id = get_my_household_id()`,
    // so an insert without household_id is rejected by the WITH CHECK clause.
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("household_id")
      .eq("id", user.id)
      .maybeSingle();

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 500 });
    }
    if (!profile?.household_id) {
      return NextResponse.json(
        { error: "No household found for this account, so nothing can be saved." },
        { status: 409 }
      );
    }
    const householdId = profile.household_id;

    let requested = Object.keys(SEED_TABLES);
    try {
      const body = await request.json();
      if (Array.isArray(body?.tables) && body.tables.length > 0) {
        requested = body.tables;
      }
    } catch {
      // No body — seed everything.
    }

    const unknown = requested.filter((t) => !(t in SEED_TABLES));
    if (unknown.length > 0) {
      return NextResponse.json(
        { error: `Unknown table(s): ${unknown.join(", ")}` },
        { status: 400 }
      );
    }

    const seeded: Record<string, number> = {};
    const skipped: string[] = [];
    const errors: Record<string, string> = {};

    for (const table of requested) {
      const { count, error: countError } = await supabase
        .from(table)
        .select("id", { count: "exact", head: true })
        .eq("household_id", householdId);

      if (countError) {
        errors[table] = countError.message;
        continue;
      }
      if ((count ?? 0) > 0) {
        skipped.push(table);
        continue;
      }

      const rows = SEED_TABLES[table]().map((row) => ({
        ...row,
        user_id: user.id,
        household_id: householdId,
      }));

      // supabase-js resolves with { error } rather than throwing. The previous
      // version wrapped these in Promise.allSettled, so every insert looked
      // "fulfilled" and rejected writes were reported as a successful seed.
      const { error } = await supabase.from(table).insert(rows);
      if (error) errors[table] = error.message;
      else seeded[table] = rows.length;
    }

    const failed = Object.keys(errors).length > 0;
    return NextResponse.json(
      { seeded, skipped, errors },
      { status: failed ? 500 : 200 }
    );
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json({ error: "Failed to seed database" }, { status: 500 });
  }
}
