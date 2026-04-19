import { redirect } from "next/navigation";


//forces redirect
export default function Home() {
  redirect("/today");
}
