// Dekodira JWT token bez provere potpisa (samo citamo sadrzaj na frontendu,
// backend je taj koji stvarno proverava validnost tokena)
export function decodeJwt(token) {
  try {
    const payload = token.split('.')[1]
    // JWT koristi base64url (ne obican base64) - zamenimo karaktere pre dekodiranja
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/')
    const json = atob(base64)
    return JSON.parse(json)
  } catch (err) {
    return null
  }
}

// Uloga (role) se u tokenu cuva pod dugackim ASP.NET claim imenom
// (npr. "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"),
// ne prosto pod "role" - zato trazimo bilo koji kljuc koji sadrzi "role"
export function getRoleFromToken(token) {
  const decoded = decodeJwt(token)
  if (!decoded) return null
  const roleKey = Object.keys(decoded).find((k) => k.toLowerCase().includes('role'))
  return roleKey ? decoded[roleKey] : null
}