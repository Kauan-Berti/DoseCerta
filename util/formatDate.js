function formatDate(date) {
  const options = { year: "numeric", month: "numeric", day: "numeric" };
  return new Date(date).toLocaleDateString(undefined, options);
}

export default formatDate;
