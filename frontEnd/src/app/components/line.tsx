export default function LineBreaker({ 
    marginUp, marginDown, lineWidth, lineHeight, lineColour
}:{
    marginUp: string
    marginDown: string
    lineWidth: string
    lineHeight: string
    lineColour: string
}
){


    return(
        <hr 
            style={{
                marginLeft: "auto",
                marginRight: "auto",
                marginTop: `${marginUp}rem`,
                marginBottom: `${marginDown}rem`,
                
                height: lineHeight,
                width: lineWidth,
                backgroundColor: lineColour,
            }}
        />
    )
}