import * as React from "react";
import { Component } from "react";

/**
 * Allows specific placement of components through the gridTemplateAreas property
 * Should be extended by any Component that will be placed in a grid
 */
export interface IGridElementProps {
  gridAreaName?: string;
}

export interface IGridProps extends IGridElementProps {
  /**
   * A string containing the order that the grid's components are placed
   */
  templateArea: string;
  cols: string;
  rows: string;
  /**
   * The elements that the grid contains. This could either be a React component or HTML
   */
  gridElements: Array<React.ReactElement<IGridElementProps | any>>;
  /**
   * The class used to target the grid for styling
   */
  className?: string;
}

/**
 * React wrapper component for CSS Grid
 */
export default class Grid extends Component<IGridProps> {
  props: IGridProps;

  constructor(props: IGridProps) {
    super(props);
  }
  render() {
    return (
      <div
        className={this.props.className}
        style={{
          display: "grid",
          gridTemplateColumns: this.props.cols,
          gridTemplateRows: this.props.rows,
          gridTemplateAreas: this.props.templateArea,
          gridArea: this.props.gridAreaName,
        }}
      >
        {...this.props.gridElements}
      </div>
    );
  }
}
