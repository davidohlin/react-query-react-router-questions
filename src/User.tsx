import { QueryClient, useQuery } from "@tanstack/react-query";
import { useLoaderData } from "react-router-dom";

interface User {
  name: string;
}

const getUser = () => {
  // Why is this called twice?
  console.log("called!");
  return new Promise<User>((r) => setTimeout(() => r({ name: "David" }), 1000));
};

const getUserQuery = () => ({
  queryKey: ["user"],
  queryFn: () => getUser(),
});

export const User = () => {
  const userData = useLoaderData() as Awaited<
    ReturnType<ReturnType<typeof loader>>
  >;

  const { data: user } = useQuery({
    ...getUserQuery(),
    initialData: userData,
  });

  return <div>{user?.name}</div>;
};

export const loader = (queryClient: QueryClient) => async () => {
  const userQuery = getUserQuery();

  // Why is userData possibly undefined here?
  // `getQueryData` will return data or undefined. If so, we await `fetchQuery` which _will_ resolve a User.
  const userData =
    queryClient.getQueryData<User>(userQuery.queryKey) ??
    (await queryClient.fetchQuery(userQuery));

  return userData;
};
