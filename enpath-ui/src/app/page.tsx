import { redirect } from "next/navigation";

// The prototype has two screens: My Career (employee) and Setup (admin). The root opens My Career.
export default function Home() {
  redirect("/me/career");
}
