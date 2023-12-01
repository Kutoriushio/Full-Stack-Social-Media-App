import { ProfileValidation } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

import ProfileUploader from "../shared/ProfileUploader";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { useUserContext } from "@/context/AuthContext";
import { Models } from "appwrite";
import { useUpdateUser } from "@/lib/react-query/queriesAndMutations";
import { useToast } from "../ui/use-toast";
import Loader from "../shared/Loader";

const ProfileForm = ({ currentUser }: { currentUser: Models.Document }) => {
  const { user, setUser } = useUserContext();
  const { toast } = useToast();
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof ProfileValidation>>({
    resolver: zodResolver(ProfileValidation),
    defaultValues: {
      file: [],
      name: currentUser.name,
      username: currentUser.username,
      email: currentUser.email,
      bio: currentUser.bio || "",
    },
  });
  const { mutateAsync: updateUser, isPending: isLoadingUpdate } =
    useUpdateUser();
  async function onSubmit(values: z.infer<typeof ProfileValidation>) {
    const updatedUser = await updateUser({
      userId: user.id,
      name: values.name,
      bio: values.bio,
      file: values.file,
      imageUrl: currentUser.imageUrl,
      imageId: currentUser.imageId,
      username: values.username,
    });

    if (!updatedUser) {
      toast({
        title: `Update profile failed. Please try again.`,
      });
    }
    setUser({
      ...user,
      name: updatedUser?.name,
      bio: updatedUser?.bio,
      imageUrl: updatedUser?.imageUrl,
    });

    return navigate(`/profile/${user.id}`);
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-9 w-full max-w-5xl"
      >
        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <ProfileUploader
                  fieldChange={field.onChange}
                  imageUrl={currentUser.imageUrl}
                />
              </FormLabel>

              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input type="text" className="shad-input" {...field} />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input type="text" className="shad-input" {...field} />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="text" className="shad-input" {...field} />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea className="shad-textarea" {...field} />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <div className="flex gap-4 items-center justify-end">
          <Button
            type="button"
            className="shad-button_dark_4"
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="shad-button_primary whitespace-nowrap h-12"
            disabled={isLoadingUpdate}
          >
            {isLoadingUpdate ? <Loader /> : <div>Update Profile</div>}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProfileForm;
