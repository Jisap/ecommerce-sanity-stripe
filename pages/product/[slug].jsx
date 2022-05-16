import React, { useState } from 'react'
import { client, urlFor} from '../../lib/client'
import { AiOutlineMinus, AiOutlinePlus, AiFillStar, AiOutlineStar } from 'react-icons/ai';
import { Product } from '../../components'
import { useStateContext } from '../../context/StateContext';

const ProductDetails = ({ product, products }) => {

  const { image, name, details, price } = product;

  const [index, setIndex] = useState(0);

  const { decQty, incQty, qty, onAdd, setShowCart } = useStateContext();

  const handleBuyNow = () => {
    onAdd( product, qty );
    setShowCart( true );
  }

  return (
    <div>
                        {/* dp:flex flex-wrap: wrap */}
        <div className="product-detail-container">
            
            <div>
                <div className="image-container">
                    <img src={ urlFor(image && image[index])} className="product-detail-image" />
                </div>
                           {/* dp: flex */}
                <div className="small-images-container">
                    { image?.map(( item, i ) => (
                        <img 
                            key={i}
                            src={urlFor(item)}
                            className={ i === index ? 'small-image selected-image' : 'small-image' }
                            onMouseEnter={() => setIndex(i)}
                        />
                    ))}
                </div>
            </div>

                       {/* dp:flex */}
            <div className="product-detail-desc">
                <h1>{ name }</h1>
                    {/* dp:flex aic */}
                <div className="reviews">
                    <div>
                        <AiFillStar />
                        <AiFillStar />
                        <AiFillStar />
                        <AiFillStar />
                        <AiFillStar />
                        <AiOutlineStar />
                    </div>
                    <p>
                        (20)
                    </p>
                </div>
                <h4>Details: </h4>
                <p>{ details }</p>
                <p className="price">${ price }</p>
                        {/* dp:flex aic */}
                <div className="quantity">
                    <h3>Quantity:</h3>
                    <p className="quantity-desc">
                        <span className="minus" onClick={ decQty }><AiOutlineMinus /></span>
                        <span className="num">{ qty }</span>
                        <span className="plus" onClick={ incQty }><AiOutlinePlus /></span>
                    </p>
                </div>
                            {/* dp:flex */}
                <div className="buttons">
                    <button type="button" className="add-to-cart" onClick={ () => onAdd( product, qty ) }>Add to Cart</button>
                    <button type="button" className="buy-now" onClick={ handleBuyNow }>Buy Now</button>
                </div>
            </div>

        </div>

                            {/* dp:flex jcc */}
        <div className="maylike-products-wrapper">
            <h2>You may also like</h2>
                   {/* pos:relative */}
            <div className="marquee">
                <div className="maylike-products-container track">
                    { products.map(( item ) => (
                        <Product key={ item._id } product={ item }/>
                    ))}
                </div>
            </div>
        </div>

    </div>
  )
}

export const getStaticPaths = async() => {
    //Query para obtener todos los slugs de cada producto
    const query = `*[_type == "product"]{   
        slug{
            current
        }
    }`;

    const products = await client.fetch( query ); // Obtengo todos los productos basados en sus slugs
    const paths = products.map(( product ) => ({  // Por cada producto obtengo su ruta basada en su slug
        params: {
            slug: product.slug.current
        }
    }))

    return{
        paths,
        fallback: 'blocking'
    }
}

export const getStaticProps = async ({ params: { slug } }) => {
    
    const query = `*[_type == "product" && slug.current == '${slug}'][0]` // Query to get the product según params de la url
    const product = await client.fetch(query);
    
    const productsQuery ='*[_type == "product"]'; // Query to get all products
    const products = await client.fetch(productsQuery)
    
    
    
    return{
        props:{
            product,
            products,
        }
    }
}

export default ProductDetails