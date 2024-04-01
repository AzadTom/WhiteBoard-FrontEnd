import { Image } from "react-konva";
import useImage from "use-image";

const URLImage = (props:any) => {

    const  {image , onclick} = props;
  
    const [img] = useImage(image.src);
  
  
    return (
      <Image
        image={img}
        x={image.x}
        y={image.y}
        offsetX={img ? img.width / 2 : 0}
        offsetY={img ? img.height / 2 : 0}
        draggable
        onClick={onclick}
      />
    );
  };

export default URLImage;

