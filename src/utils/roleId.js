/** Engineering T-10####, DevOps T-20####, QA T-30#### */
export const ROLE_ID_PATTERN = /^T-(10|20|30)\d{4}$/;

export function isValidRoleId(roleId) {
  return typeof roleId === "string" && ROLE_ID_PATTERN.test(roleId.trim());
}

export function roleIdHint() {
  return "T-10#### (engineering), T-20#### (DevOps), T-30#### (QA)—four digits after the prefix.";
}
