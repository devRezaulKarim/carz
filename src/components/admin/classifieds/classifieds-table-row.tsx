import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import { ClassifiedBadgeMap } from "@/config/constants";
import { ClassifiedWithImages } from "@/config/types";
import { formatClassifiedStatus, formatColor, formatPrice } from "@/lib/utils";
import { format } from "date-fns";
import Image from "next/image";
import { ClassifiedsActionButtons } from "./classifieds-action-buttons";

export const ClassifiedsTableRow = ({
  classified,
}: {
  classified: ClassifiedWithImages;
}) => {
  return (
    <TableRow className="border-white/75 text-gray-300 hover:bg-transparent">
      <TableCell className="font-medium">{classified.id}</TableCell>
      <TableCell className="p-0">
        <Image
          width={120}
          height={80}
          src={classified.images[0].src}
          alt={classified.images[0].alt}
          quality={100}
          blurDataURL={classified.images[0].blurhash}
          placeholder="blur"
          className="aspect-3/2 rounded object-cover p-[2px]"
        />
      </TableCell>
      <TableCell>{classified.title}</TableCell>
      <TableCell>
        {formatPrice({
          price: classified.price,
          currency: classified.currency,
        })}
      </TableCell>
      <TableCell className="hidden md:table-cell">{classified.vrm}</TableCell>
      <TableCell className="hidden md:table-cell">
        {formatColor(classified.color)}
      </TableCell>
      <TableCell>
        <Badge variant={ClassifiedBadgeMap[classified.status]}>
          {formatClassifiedStatus(classified.status)}
        </Badge>
      </TableCell>
      <TableCell className="hidden md:table-cell">
        {format(classified.createdAt, "dd MMM yyy HH:mm")}
      </TableCell>
      <TableCell className="hidden md:table-cell">{classified.views}</TableCell>
      <TableCell>
        <ClassifiedsActionButtons classified={classified} />
      </TableCell>
    </TableRow>
  );
};
