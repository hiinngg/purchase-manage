export default function (id) {
  const element = document.getElementById(id);
  element?.focus();
  element?.scrollIntoView({ behavior: "smooth", block: "center" });
}
