export function validarAcceso(panel, password) {

  if(panel === "admin" && password !== "toto321") return false;
  if(panel === "mozo" && password !== "mozo2026") return false;
  if(panel === "cocina" && password !== "cocina2026") return false;

  return true;
}