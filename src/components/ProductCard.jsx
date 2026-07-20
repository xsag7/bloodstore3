import React from 'react';

export const ProductCard = ({ product, onSelectProduct }) => {
  const benefits = Array.isArray(product.benefits) 
    ? product.benefits 
    : (typeof product.benefits === 'string' ? product.benefits.split('\n') : []);

  return (
    <div className="product-card">
      <div>
        <div className="product-img-box">
          {product.category && (
            <span className="product-category-badge">
              <i className="fa-solid fa-tag"></i> {product.category}
            </span>
          )}
          <img 
            src={product.image || "/fotos e videos/robux.png"} 
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextElementSibling.style.display = 'flex';
            }} 
            alt={product.name} 
            className="product-img" 
          />
          <div className="product-icon-fallback" style={{ display: 'none' }}>
            <i className={product.icon || "fa-solid fa-box"}></i>
          </div>
        </div>

        <div className="product-body">
          <h3 className="product-title">{product.name}</h3>
          <div className="product-slug">{product.slug || product.name}</div>
          <div className="product-price">{product.priceText} <span>/ único</span></div>
          <div className="product-benefits">
            {benefits.map((b, idx) => (
              <div key={idx} className="benefit-item">
                <i className="fa-solid fa-check"></i>
                <span>{b}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="product-footer">
        <button onClick={() => onSelectProduct(product)} className="btn-buy">
          COMPRAR <i className="fa-solid fa-cart-shopping"></i>
        </button>
      </div>
    </div>
  );
};
