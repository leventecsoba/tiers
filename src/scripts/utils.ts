export const getRandomColor = () => {
    const decimalComponents: number[] = []
    for (let i = 0; i<3;i++) {
        const randomByte = Math.floor(Math.random() * 256)
        decimalComponents.push(randomByte)
    }
    const hexComponents = decimalComponents.map((decimal) => decimal.toString(16).padStart(2, "0"))
    return `#${hexComponents.join("")}`
}