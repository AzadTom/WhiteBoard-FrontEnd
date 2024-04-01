import { useEffect, useRef, useState } from "react";
import { Arrow, Circle, Layer, Line, Rect, Stage, Transformer } from "react-konva";
import { v4 as uuid } from "uuid";

import Controls from "./Controls";

import { ACTIONS } from "../utils/constant";

import { KonvaEventObject } from "konva/lib/Node";

import URLImage from "./URLImage";

import { ArrowType, RectangleType, ScribbleType, CircleType, ImageType } from "../types/PainTypes";

import { io } from 'socket.io-client';


const socket = io('http://localhost:3001');


function Editor() {

  const stageRef = useRef<any>(null);

  const [action, setAction] = useState<string>(ACTIONS.SELECT);

  const [fillcolor, setFillColor] = useState<string>("ffffff");

  const currentShapeId = useRef<any>(null);
  const isPainting = useRef<boolean>(false);
  const transformRef = useRef<any>(null);

  const [images, setImages] = useState<ImageType[]>([]);

  const [rectangles, setRectangles] = useState<RectangleType[]>([]);
  const [circles, setCircles] = useState<CircleType[]>([]);
  const [arrows, setArrows] = useState<ArrowType[]>([]);
  const [scribbles, setScribble] = useState<ScribbleType[]>([]);
  


  useEffect(() => {

    socket.on('server-ready', () => {

      console.log("connected!");

    });


    socket.on('onrectangle', (rect:RectangleType) => {

       if(rectangles.includes(rect)) return;
       setRectangles((prev)=>[...prev,rect]);

    });



    socket.on('oncircle', (circle:CircleType) => {

      if(circles.includes(circle)) return;
      setCircles((prev)=>[...prev,circle]);

   });

    socket.on('onarrow', (arrow:ArrowType) => {

       if(arrows.includes(arrow)) return; 
      setArrows((prev)=>[...prev,arrow]);

  });


  socket.on('onscribble', (scribble:ScribbleType) => {

    if(scribbles.includes(scribble)) return; 
    setScribble((prev)=>[...prev,scribble]);

 });


    

  }, [stageRef])

  const onpointerdown = () => {


    if (action === ACTIONS.SELECT) return;

    const stage = stageRef.current;

    const { x, y } = stage.getPointerPosition();

    const id = uuid();

    currentShapeId.current = id;
    isPainting.current = true;


    switch (action) {

      case ACTIONS.RECTANGLE:



        setRectangles((rects: RectangleType[]) => [
          ...rects,
          {
            id,
            x,
            y,
            width: 20,
            height: 20,
            fillcolor

          },
        ]);


        const rect: RectangleType = { id, x, y, width:20, height:20, fillcolor };
        socket.emit('rectangle', rect);
        break;

      case ACTIONS.CIRCLE:
        setCircles((circles: CircleType[]) => [
          ...circles,
          {
            id,
            x,
            y,
            radius: 20,
            fillcolor
          }
        ]);
        const circle  = {id,x,y,radius:20,fillcolor};
        socket.emit('circle', circle);
        break;

      case ACTIONS.ARROW:

        setArrows((arrows: ArrowType[]) => [
          ...arrows,
          {
            id,
            points: [x, y, x + 20, y + 20],
            fillcolor
          }
        ]);
        const arrow  = {id,points:[x,y,x+20,y+20],fillcolor};
        socket.emit('arrow', arrow);
        break;

      case ACTIONS.SCRIBBLE:
        setScribble((scribbles: ScribbleType[]) => [
          ...scribbles,
          {
            id,
            points: [x, y],
            fillcolor
          }
        ]);
        const scribble  = {id,points:[x,y],fillcolor};
        socket.emit('scribble', scribble);
        break;

      

    }








  }


  const onpointermove = () => {



    if (action === ACTIONS.SELECT || !isPainting.current) return;


    const stage = stageRef.current;
    const { x, y } = stage.getPointerPosition();

    switch (action) {


      case ACTIONS.RECTANGLE:

        setRectangles((rects: RectangleType[]) => rects.map((rec: RectangleType) => {
          if (rec.id === currentShapeId.current) {

            const rect: RectangleType = {...rec, width:x-rec.x,height:y-rec.y};
            socket.emit('rectangle', rect);

            return {
              ...rec,
              width: x - rec.x,
              height: y - rec.y
            }
          

          }
          return rec;
        }));
        break;

      case ACTIONS.CIRCLE:
        setCircles((circles) => circles.map((cir) => {

          if (cir.id === currentShapeId.current) {

            const circle: CircleType = {...cir,radius: ((y - cir.y) ** 2 + (x - cir.y) ** 2) ** 0.5};
            socket.emit('circle', circle);

            return {
              ...cir,
              radius: ((y - cir.y) ** 2 + (x - cir.y) ** 2) ** 0.5
            }
          }
          return cir;
        }))
        break;

      case ACTIONS.ARROW:
        setArrows((arrows: ArrowType[]) => arrows.map((arrow: ArrowType) => {

          if (arrow.id === currentShapeId.current) {

            const arrowshape: ArrowType = { ...arrow ,points: [arrow.points[0], arrow.points[1], x, y],fillcolor: fillcolor};
            socket.emit('arrow', arrowshape);

            return {
              ...arrow,
              points: [arrow.points[0], arrow.points[1], x, y],
              fillcolor: fillcolor
            }
          }
          return arrow;

        }));
        break;
      case ACTIONS.SCRIBBLE:
        setScribble((scribbles: ScribbleType[]) => scribbles.map((scribble) => {

          if (scribble.id === currentShapeId.current) {

            const scribbleshape: ArrowType = { ...scribble ,points: [...scribble.points, x, y]};
            socket.emit('scribble', scribbleshape);


            return {
              ...scribble,
              points: [...scribble.points, x, y]
            }
          }
          return scribble;
        }));
        break;
      





    }







  }


  const onpointerup = () => {


    isPainting.current = false;


  }

  const handleExport = () => {

    const uri = stageRef.current.toDataURL();
    const link = document.createElement("a");
    link.download = "image.png";
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

  }


  const onclick = (e: KonvaEventObject<MouseEvent>) => {

    if (action !== ACTIONS.SELECT) return;

    const target = e.currentTarget;
    transformRef?.current?.nodes([target]);

  }



  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {

    if (event.target.files) {

      const fileArray = Array.from(event.target.files);

      handleFilesChange(fileArray);

    }

  };


  const handleFilesChange = (files: File[]) => {

    const filesArray = files.map((file) => {

      const url = URL.createObjectURL(file);

      return { src: url, x: 0, y: 0 };

    });


    setImages((images) => [...images, ...filesArray]);

  }

  return (
    <>
      <div className="container">

        <Controls handleExport={handleExport} action={action} setAction={setAction} fillcolor={fillcolor} setFillColor={(value: string) => setFillColor(value)} handleFileChange={(event: React.ChangeEvent<HTMLInputElement>) => handleFileChange(event)} />
        <Stage
          ref={stageRef}
          width={window.innerWidth}
          height={window.innerHeight}
          onPointerDown={onpointerdown}
          onPointerMove={onpointermove}
          onPointerUp={onpointerup}
        >
          <Layer>
            <Rect
              x={0}
              y={0}
              width={window.innerWidth}
              height={window.innerHeight}
              fill="#f5f5f5"
              id="bg"
              onClick={() => {
                transformRef?.current?.nodes([]);

              }}

            />
            {rectangles.map((rec) => <Rect key={rec.id} x={rec.x} y={rec.y} fill={rec.fillcolor} width={rec.width} height={rec.height} draggable={action == ACTIONS.SELECT} onClick={onclick} />)}
            {circles.map((cir) => <Circle key={cir.id} x={cir.x} y={cir.y} radius={cir.radius} fill={cir.fillcolor} draggable={action == ACTIONS.SELECT} onClick={onclick} />)}
            {arrows.map((arrow) => <Arrow key={arrow.id} points={arrow.points} stroke={fillcolor} strokeWidth={2} fill={arrow.fillcolor} draggable={action == ACTIONS.SELECT} onClick={onclick} />)}
            {scribbles.map((scribble) => <Line key={scribble.id} points={scribble.points} fill={scribble.fillcolor} tension={0.5} stroke={fillcolor} strokeWidth={2} lineCap="round" lineJoin="round" draggable={action == ACTIONS.SELECT} />)}
            {images.map((image, index) => (<URLImage key={index * 3} image={image} onclick={onclick} />))}
            <Transformer ref={transformRef} />
          </Layer>
        </Stage>

      </div>
    </>
  )
}

export default Editor;