import sanityClient from '@sanity/client';
import  imageUrlBuilder from '@sanity/image-url';

export const client = sanityClient({                // Credenciales del cliente de Sanity
    projectId: 'g1vdsyhq',
    dataset:'production',
    apiVersion:'2022-03-10',
    useCdn: true,
    token: process.env.NEXT_PUBLIC_SANITY_TOKEN,
});

const builder = imageUrlBuilder( client );          // Constructor de URL de las imagenes basadas en el cliente de Sanity

export const urlFor = ( source ) => builder.image( source )   // Exportación de las urls basadas en el contructor