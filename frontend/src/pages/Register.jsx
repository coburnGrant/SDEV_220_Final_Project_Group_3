import Form from "../components/Form";
import { FORM_METHOD_REGISTER } from "../constants";

function Register() {
    return <Form route="/api/users/register/" method={FORM_METHOD_REGISTER} />
}

export default Register;