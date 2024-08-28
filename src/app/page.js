import Image from "next/image";
import TicketForm from './TicketForm';
import Topbar from './Topbar';

export default function Home() {
  return (
    <div>
      <Topbar />
      <TicketForm />
    </div>
  );
}
