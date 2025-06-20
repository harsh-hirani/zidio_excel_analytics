const Header = ({text,className}) => {
    return (
        <h1 class={"mb-2 mt-0 text-5xl font-medium leading-tight text-primary "+className}>
            {text}
        </h1>
    )
}
export default  Header