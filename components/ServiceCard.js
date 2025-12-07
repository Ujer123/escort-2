import Image from "next/image";

export default function ServiceCard({ service }) {
  return (
    <div className="border rounded-lg shadow hover:shadow-lg transition p-4">
      <Image
        src={service.image || "/images/placeholder.jpg"}
        alt={service.name}
        width={400}
        height={250}
        className="rounded-lg"
      />
      <h2 className="text-xl font-semibold mt-3">{service.name}</h2>
      <p className="text-gray-600">{service.description}</p>
      <p className="text-blue-600 font-bold mt-2">${service.price}</p>
    </div>
  );
}