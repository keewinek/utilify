export interface HeadDataParams
{
    title?: string,
    description?: string,
    image?: string,
    keywords?: string
}

export default function HeadData(
    {
        title = "Utilify - Make your life easier.", 
        description = "Utlifiy is an platform with a lot of tools. Developers can also create their own tools.", 
        image = "/logo_bg.png", 
        keywords = "Utilify, Tool, Generator, Calculator, Converter"
    }: HeadDataParams)
{
    return(
        <>
            <title>{title}</title>

            <meta name="description" content={description}/>
            <meta name="keywords" content={keywords}/>
            <meta name="author" content="keewinek"/>
            <meta name="theme-color" content="#020204"/>

            <meta property="og:title" content={title}/>
            <meta property="og:site_name" content={title}/>
            <meta property="og:url" content="https://utilify.deno.dev"/>
            <meta property="og:description" content={description}/>
            <meta property="og:type" content="website"/>
            <meta property="og:image" content={image}></meta>
        </>
    )
}