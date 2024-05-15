export const haveSameInterface = (obj1: object, obj2: object): boolean => {
    const obj1Interface: any = obj1
    const obj2Interface: any = obj2

    return (
        Object.keys(obj1Interface).length ===
            Object.keys(obj2Interface).length &&
        Object.keys(obj1Interface).every(
            key => typeof obj1Interface[key] === typeof obj2Interface[key]
        )
    )
}
