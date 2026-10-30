export const USER_COLUMNS =
  "id, username, email, first_name, last_name, birth_date, location, monthly_goal_tco2";

/** Linha do banco -> formato esperado pelo frontend (camelCase, sem hash). */
export function serializeUser(row) {
  return {
    id: row.id,
    username: row.username,
    email: row.email,
    firstName: row.first_name,
    lastName: row.last_name,
    birthDate: row.birth_date,
    location: row.location,
    monthlyGoalTco2: row.monthly_goal_tco2,
  };
}
