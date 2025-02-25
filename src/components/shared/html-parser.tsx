import parse from "html-react-parser";
import sanitizeHtml from "sanitize-html";
const HTMLParser = ({ html }: { html: string }) => {
  return parse(sanitizeHtml(html));
};
export default HTMLParser;
