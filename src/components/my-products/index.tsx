import { getProducts } from "./utils";
import "./index.css";

export default async function MyProducts() {
  const products = await getProducts();

  if (products.length === 0) return null;

  return (
    <ul className="my-products">
      {products.map((product) => (
        <li key={product.href}>
          <a href={product.href} rel="noreferrer" target="_blank">
            {product.icon && <img alt={product.name} src={product.icon} />}
            <strong>{product.name}</strong>: {product.desc}
          </a>
        </li>
      ))}
    </ul>
  );
}
