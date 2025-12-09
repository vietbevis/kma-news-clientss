import { Block, SubjectTypeProps } from "@/global";
import BlockDescription from "./blocks/BlockDescription";
import CommonBlock from "./blocks/CommonBlock";
import SemesterBlock from "./blocks/SemesterBlock";
import SliderBlock from "./blocks/SliderBlock";

function renderBlock(
  block: Block,
  index: number,
  subjectType?: SubjectTypeProps[]
) {
  switch (block.__component) {
    case "blocks.common-block":
      switch (block.variants) {
        // case "news":
        //   return <NewsBlock {...block} key={index} />;
        case "slider":
          return <SliderBlock {...block} key={index} />;
        // case "events":
        //   return <EventBlock {...block} key={index} />;
        // case "trainning":
        //   return <TrainingBlock {...block} key={index} />;
        // case "cooperation":
        //   return <CooperationBlock {...block} key={index} />;
        // case "alumni":
        //   return <AlumniBlock {...block} key={index} />;
        default:
          return <CommonBlock {...block} key={index} />;
      }
    case "blocks.semester-block":
      return (
        <SemesterBlock
          data={block}
          key={index}
          id={index}
          subjectType={subjectType}
        />
      );
    case "elements.block-description":
      return <BlockDescription {...block} key={index} id={index} />;
    default:
      return null;
  }
}

export function BlockRenderer({
  blocks,
  subjectType,
}: {
  blocks: Block[];
  subjectType?: SubjectTypeProps[];
}) {
  return blocks.map((block, index) => renderBlock(block, index, subjectType));
}
