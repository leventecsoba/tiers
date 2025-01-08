const MAX_TICK_COUNT = 10
const TICK_LENGTH = 10
const SVG_HEIGHT = 500
const BAR_WIDTH = SVG_HEIGHT / 10
const VALUE_INDICATOR_COLOR = "#d6d6d6"
const DEFAULT_ELEMENT_PADDING = 10

interface BarChartData {
    label: string
    value: number
}

type Position = "left" | "right" | "top" | "bottom"

interface ElementOptions {
    label?: string
    labelPosition?: Position
    hexColor?: string
}

type LineOptions = ElementOptions
type RectangleOptions = ElementOptions

const BAR_CHART_DATA = [
    {value: 62, label: "One"},
    {value: 31, label: "Two"},
    {value: 17, label: "Three"},
    {value: 73, label: "Four"},
    {value: 141, label: "Five"},
    {value: 4, label: "Six"}
]

const getSVGElementBoundingBox = (element: SVGElement): DOMRect => {
    const svgContainer = document.createElementNS("http://www.w3.org/2000/svg", "svg")
    svgContainer.setAttribute('width', '0');
    svgContainer.setAttribute('height', '0');
    svgContainer.appendChild(element)
    document.body.appendChild(svgContainer)
    const boundingBox = element.getBoundingClientRect();
    document.body.removeChild(svgContainer);
    return boundingBox;
}

const getRelativeElementPosition = (x: number, y: number, boundingBox: DOMRect, position: Position, padding: number = DEFAULT_ELEMENT_PADDING): [number, number] => {
    switch (position) {
        case "left":
            return [x - (boundingBox.width / 2) - padding, y + (boundingBox.height / 4)]
        case "right":
            return [x + (boundingBox.width / 2) + padding, y + (boundingBox.height / 4)]
        case "top":
            return [x - (boundingBox.width / 2), y - padding]
        case "bottom":
            return [x - (boundingBox.width / 2), y + (boundingBox.height / 4) + padding]
        default:
            return [0, 0]
    }
}

const drawLabel = (container: SVGElement, x: number, y: number, label: string, labelPosition: Position = "left") => {
    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.textContent = label;
    const textBoundingBox = getSVGElementBoundingBox(text)
    const [textX, textY] = getRelativeElementPosition(x, y, textBoundingBox, labelPosition)
    text.setAttribute('x', textX.toString())
    text.setAttribute('y', textY.toString())
    container.appendChild(text)
}

const drawLine = (container: SVGElement, startX: number, startY: number, rotationDegrees: number, lengthPixels: number, options?: LineOptions) => {
    const {label, labelPosition, hexColor} = options ?? {}
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line")

    // calculate end position based on rotation and length
    const rotationRadians = rotationDegrees * (Math.PI / 180)
    const endX = startX + lengthPixels * Math.cos(rotationRadians)
    const endY = startY + lengthPixels * Math.sin(rotationRadians)
    const roundedEndX = Math.abs(endX) < 1e-10 ? 0 : endX
    const roundedEndY = Math.abs(endY) < 1e-10 ? 0 : endY

    line.setAttribute("x1", startX.toString())
    line.setAttribute("y1", startY.toString())
    line.setAttribute("x2", roundedEndX.toString())
    line.setAttribute("y2", roundedEndY.toString())
    line.style.stroke = hexColor ?? "black"
    line.style.strokeWidth = "1px"
    container.appendChild(line)
    if (label) {
        drawLabel(container, startX, startY, label, labelPosition)
    }
    return {element: line, startX, endX: roundedEndX, startY, endY: roundedEndY}
}

const drawRectangle = (container: SVGElement, x: number, y: number, height: number, width: number, options?: RectangleOptions) => {
    const {label, labelPosition, hexColor} = options ?? {}
    const rectangle = document.createElementNS("http://www.w3.org/2000/svg", "rect")
    rectangle.setAttribute("x", x.toString())
    rectangle.setAttribute("y", y.toString())
    rectangle.setAttribute("height", height.toString())
    rectangle.setAttribute("width", width.toString())
    rectangle.style.fill = hexColor ?? "red"
    container.appendChild(rectangle)
    if (label) {
        drawLabel(container, x + (width / 2), y, label, labelPosition)
    }
    return {element: rectangle, x, y}
}

const getNiceValue = (uglyValue: number): number => {
    let niceValue = Math.pow(10, Math.floor(Math.log10(uglyValue)));
    if (uglyValue > niceValue * 2) {
        niceValue *= 2;
    } else if (uglyValue > niceValue * 5) {
        niceValue *= 5;
    }
    return niceValue
}

const getCenteredPosition = (basePosition: number, axis: "x" | "y", dimension: number) => {
    const offset = dimension / 2
    return axis === "x" ? basePosition - offset : basePosition + offset
}

const drawBarChart = (container: HTMLElement, data: BarChartData[]) => {
    const svgContainer = document.createElementNS("http://www.w3.org/2000/svg", "svg")
    svgContainer.setAttribute("height", SVG_HEIGHT.toString())
    svgContainer.setAttribute("width", SVG_HEIGHT.toString())
    svgContainer.setAttribute("overflow", "visible")

    // Calculate min/max value and range
    const values = data.map((e) => e.value);
    const minValue = Math.min(0, ...values); // Supports negative minimum values
    const maxValue = Math.max(...values);
    const range = maxValue - minValue;

    // Calculate tick interval
    const tickInterval = Math.ceil(range / MAX_TICK_COUNT);
    const niceTickInterval = getNiceValue(tickInterval);
    const niceMaxValue = Math.ceil(maxValue / niceTickInterval) * niceTickInterval;
    const niceMinValue = Math.floor(minValue / niceTickInterval) * niceTickInterval;
    const niceRange = niceMaxValue - niceMinValue

    const verticalTickCount = Math.ceil(niceRange / niceTickInterval)
    const horizontalTickCount = data.length

    // draw y-axis value indicators first, so they are in the background
    for (let i = 1; i < verticalTickCount; i++) {
        const indicatorValue = i * niceTickInterval;
        const indicatorY = SVG_HEIGHT - ((indicatorValue - niceMinValue) / niceRange) * SVG_HEIGHT;

        const tickValueOptions: LineOptions = {hexColor: VALUE_INDICATOR_COLOR}
        drawLine(svgContainer, 0, indicatorY, 0, SVG_HEIGHT, tickValueOptions);
    }

    // draw bars second, so they are in the middle
    for (let i = 0; i < horizontalTickCount; i++) {
        const {value} = data[i]

        const barSpacing = SVG_HEIGHT / (horizontalTickCount + 1);
        const barHeight = ((value - niceMinValue) / niceRange) * SVG_HEIGHT;

        const barX = getCenteredPosition((i + 1) * barSpacing, "x", BAR_WIDTH)
        const barY = SVG_HEIGHT - barHeight

        const barOptions: RectangleOptions = {label: value.toString(),labelPosition: "top"}
        drawRectangle(svgContainer, barX, barY, barHeight, BAR_WIDTH, barOptions)
    }

    // draw axis', ticks and tips, so they are on top
    const xAxis = drawLine(svgContainer, 0, SVG_HEIGHT, 0, SVG_HEIGHT)
    const yAxis = drawLine(svgContainer, 0, SVG_HEIGHT, -90, SVG_HEIGHT)

    // draw x-axis tip
    drawLine(svgContainer, xAxis.endX, xAxis.endY, 135, 10)
    drawLine(svgContainer, xAxis.endX, xAxis.endY, -135, 10)

    // draw y-axis tip
    drawLine(svgContainer, yAxis.endX, yAxis.endY, 45, 10)
    drawLine(svgContainer, yAxis.endX, yAxis.endY, 135, 10)

    // draw y-axis ticks
    for (let i = 1; i < verticalTickCount; i++) {
        const tickValue = i * niceTickInterval;

        const tickX = getCenteredPosition(0, "x", TICK_LENGTH)
        const tickY = SVG_HEIGHT - ((tickValue - niceMinValue) / niceRange) * SVG_HEIGHT;

        const tickOptions: LineOptions = {label: tickValue.toString(), labelPosition: "left"}
        drawLine(svgContainer, tickX, tickY, 0, TICK_LENGTH, tickOptions);
    }

    // draw x-axis ticks (vertical)
    for (let i = 0; i < horizontalTickCount; i++) {
        const {label} = data[i]
        const tickSpacing = SVG_HEIGHT / (horizontalTickCount + 1);

        const tickX = (i + 1) * tickSpacing
        const tickY = getCenteredPosition(SVG_HEIGHT, "y", TICK_LENGTH)

        const tickOptions: LineOptions = {label, labelPosition: "bottom"}
        drawLine(svgContainer, tickX, tickY, -90, TICK_LENGTH, tickOptions)
    }

    container.appendChild(svgContainer)
}

const doDraw = () => {
    const container = document.getElementById("container")
    if (!container) {
        console.log("no container?? gonna cry??")
        return
    }
    drawBarChart(container, BAR_CHART_DATA)
}

doDraw()
