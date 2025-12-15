import { updateUserSchema } from "@/lib/validators";
import z from "zod";

type UpdateUserFormProps = {
  user: z.infer<typeof updateUserSchema>
}

const UpdateUserForm = ({ user }: UpdateUserFormProps) => {
  return <form>form</form>;
};

export default UpdateUserForm;
