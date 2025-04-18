import Form from "../components/Form";

function Register() {
    return <Form route="/api/user/register/" method={FORM_METHOD_REGISTER} />
}

export default Register;