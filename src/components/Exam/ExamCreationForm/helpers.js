import dayjs from "dayjs";

export const transformToFinalStructure = (formData) => {
  const result = [];

  Object.entries(formData.topicQuestionCounts || {}).forEach(
    ([topicId, questionCounts]) => {
      // Skip if no questions selected for this topic
      const totalQuestions =
        (questionCounts?.mcq || 0) +
        (questionCounts?.assertionReason || 0) +
        (questionCounts?.numerical || 0);
      if (totalQuestions === 0) return;

      // Find topic, chapter, and subject information
      let topicData = null;
      let chapterData = null;
      let subjectData = null;

      // Find the topic in availableTopics
      for (const [chapterId, topics] of Object.entries(availableTopics)) {
        const foundTopic = topics.find((topic) => topic.value === topicId);
        if (foundTopic) {
          topicData = foundTopic;

          // Find the chapter
          for (const [subjectId, chapters] of Object.entries(
            availableChapters
          )) {
            const foundChapter = chapters.find(
              (chapter) => chapter.value === chapterId
            );
            if (foundChapter) {
              chapterData = foundChapter;

              // Find the subject
              subjectData = availableSubjects.find(
                (subject) => subject.value === subjectId
              );
              break;
            }
          }
          break;
        }
      }

      // Add to result array
      result.push({
        topic: topicData?.label || "Unknown Topic",
        subject: subjectData?.label || "Unknown Subject",
        chapter: chapterData?.label || "Unknown Chapter",
        questions_counts: {
          mcq: questionCounts?.mcq || 0,
          assertionReason: questionCounts?.assertionReason || 0,
          numerical: questionCounts?.numerical || 0,
          total: totalQuestions,
        },
      });
    }
  );

  return result;
};


export function processExamData(input) {
  // Convert examDate + duration → start and end timing
  const start = dayjs(input.examDate);
  const end = start.add(input.duration, "minute");

  return {
    examTitle: input.examTitle,
    subtitle: input.subtitle,
    instructions: input.instructions,
    examType: input.examType,
    examMode: input.examMode,
    examCategory: input.examCategory,
    groups: input.selectedGroups || [],
    subjects: input.selectedSubjects || [],
    chapters: input.selectedChapters || [],
    topics: input.selectedTopics || [],
    topicQuestionCounts: input.topicQuestionCounts || {},
    totalQuestions: input.totalQuestions,
    totalMarks: input.totalMarks,
    confirmed: input.confirmed || false,

    timing: {
      start: start.toISOString(), // string instead of Date
      end: end.toISOString(),
    },
  };
}