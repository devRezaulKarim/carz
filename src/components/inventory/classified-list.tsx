import React from "react";
import ClassifiedCard from "./classified-card";
import { ClassifiedWithImage } from "@/config/types";

interface ClassifiedsListProps {
  classifieds: ClassifiedWithImage[];
  favorites: number[];
}

const ClassifiedList = ({ classifieds, favorites }: ClassifiedsListProps) => {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
      {classifieds.map((classified) => {
        return (
          <ClassifiedCard
            key={classified.id}
            classified={classified}
            favorites={favorites}
          />
        );
      })}
    </div>
  );
};

export default ClassifiedList;
