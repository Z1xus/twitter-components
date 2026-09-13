export default function baseLinks({ base }) {
  const prefix = base.replace(/\/$/, "");
  return function transform(tree) {
    function visit(node) {
      if (
        ["link", "image", "definition"].includes(node.type) &&
        node.url?.startsWith("/") &&
        !node.url.startsWith("//") &&
        node.url !== prefix &&
        !node.url.startsWith(`${prefix}/`)
      ) {
        node.url = `${prefix}${node.url}`;
      }
      node.children?.forEach(visit);
    }
    visit(tree);
  };
}
