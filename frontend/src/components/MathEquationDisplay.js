import 'katex/dist/katex.min.css';
import Latex from 'react-latex-next';

const x = 2;
const y = 3;
const base = 5;

function Example() {
  return (
  <Latex>{`$\\frac{\\frac{\\frac{${base}^{${x}}}{${base}^{${y}}}}{\\frac{${base}^{${x}}}{${base}^{${y}}}}}{\\frac{${base}^{${x}}}{${base}^{${y}}}} = 1$`}</Latex>
  );
}

export default Example;