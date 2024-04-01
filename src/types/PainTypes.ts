export interface ArrowType {

    id: string,
    points: number[],
    fillcolor: string
  }

  export interface ScribbleType {

    id: string,
    points: number[],
    fillcolor: string
  }


  export interface RectangleType {
    id: string,
    x: number,
    y: number,
    width: number,
    height: number,
    fillcolor: string
  }

  export interface ImageType {
    x: number;
    y: number;
    src: string | null;
  }


  export interface CircleType {

    id: string,
    x: number,
    y: number,
    radius: number,
    fillcolor: string
  }