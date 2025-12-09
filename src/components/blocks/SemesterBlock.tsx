import { SemesterBlockProps, SubjectTypeProps } from "@/global";
import { getTranslations } from "next-intl/server";
import { Badge } from "../ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

interface Props {
  data: SemesterBlockProps;
  subjectType?: SubjectTypeProps[];
  id: number;
}

export default async function SemesterBlock({ data, subjectType, id }: Props) {
  const t = await getTranslations("Common");
  const semestersData = data.semesters ? data.semesters : [];
  return (
    <div className="mb-12">
      <div className="relative mb-12">
        <h3
          className="text-2xl md:text-3xl uppercase font-bold text-blue-900"
          id={`heading-${id}`}
          data-index={id}
        >
          {data.title}
        </h3>
        <div className="absolute -bottom-2 w-20 h-1 bg-gradient-to-r from-red-500/60 to-red-500 rounded-full"></div>
      </div>

      <div className="flex flex-col gap-6">
        {semestersData
          .sort((a, b) => a.semester - b.semester)
          .map((semester) => (
            <div key={semester.id} className="flex gap-3 items-start">
              <h3 className="text-xl text-center uppercase font-bold semester-name text-blue-900 sticky lg:top-16 top-4">
                {t("semester")} {semester.semester}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 w-full items-stretch">
                {semester.subjects.map((subject, index) => {
                  const subjectType: SubjectTypeProps = subject.subjectType
                    ? subject.subjectType
                    : {
                        id: index,
                        type: "Chung",
                        color: "#1c398e",
                        documentId: String(index),
                      };
                  return (
                    <Tooltip key={subject.id}>
                      <TooltipTrigger asChild>
                        <div
                          className="space-y-3 cursor-pointer bg-white rounded-lg shadow border border-border border-l-4 p-4 hover:shadow-md transition-shadow"
                          style={{
                            borderLeftColor: subjectType.color,
                          }}
                        >
                          <div>
                            <Badge
                              className="text-xs mb-4"
                              variant="outline"
                              style={{
                                backgroundColor: `${subjectType.color}10`,
                                color: subjectType.color,
                                borderColor: subjectType.color,
                              }}
                            >
                              {subject.credits} {t("credits")}
                            </Badge>

                            <h3
                              className="font-semibold leading-tight whitespace-pre-wrap"
                              style={{ color: subjectType.color }}
                            >
                              {subject.name}
                            </h3>
                          </div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{subjectType.type}</p>
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </div>
            </div>
          ))}
      </div>

      <div className="md:sticky bottom-0 mt-8 bg-white/95 border-t border-gray-200 p-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">
          {t("subjectTypesLegend")}
        </h4>
        <div className="flex flex-wrap gap-3">
          {subjectType?.map((subject) => (
            <div
              key={subject.id}
              className="flex items-center cursor-pointer gap-2 text-sm px-3 py-1 rounded-full border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: subject.color }}
              ></div>
              <span className="font-medium text-gray-700">{subject.type}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
