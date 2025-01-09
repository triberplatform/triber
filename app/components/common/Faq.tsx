'use client'
import React, { useState } from 'react';

// Define the shape of each FAQ item
type FaqItem = {
  question: string;
  answer: string;
};

// Sample FAQ data
const faqData: FaqItem[] = [
  {
    question: "How does Triber help my startup secure funding?",
    answer: "Triber connects startups with a network of investors looking for innovative ideas, providing a platform for startups to showcase their financials, market strategy, and growth potential."
  },
  {
    question: "Is my financial data secure on Triber?",
    answer: "Yes, Triber uses top-level encryption and security protocols to ensure that all financial data is safe and accessible only by authorized users."
  },
  {
    question: "What if my startup isn’t ready for investment?",
    answer: "Once your startup profile is complete, you can browse potential investors and connect with them directly through the platform’s messaging and scheduling tools."
  },
  {
    question: "How do I connect with investors through Triber?",
    answer: "Once your startup profile is complete, you can browse potential investors and connect with them directly through the platform’s messaging and scheduling tools."
  },
  {
    question: "How do I connect with investors through Triber?",
    answer: "Once your startup profile is complete, you can browse potential investors and connect with them directly through the platform’s messaging and scheduling tools."
  },
  {
    question: "How do I connect with investors through Triber?",
    answer: "Once your startup profile is complete, you can browse potential investors and connect with them directly through the platform’s messaging and scheduling tools."
  }
];

const Faq: React.FC = () => {
  // State to track which question is selected; use `number | null` to allow null values
  const [selectedQuestion, setSelectedQuestion] = useState<number>(0);

  // Toggle selected question
  const handleQuestionClick = (index: number) => {
    setSelectedQuestion(selectedQuestion === index ? 0 : index);
  };

  return (
    <div className='lg:px-[10%] px-5 py-20'>
      <p className='lg:text-4xl text-3xl font-serif  font-semibold mb-4 lg:mb-8'>Frequently Asked Questions</p>
      
      <div className="lg:grid flex flex-col-reverse lg:grid-cols-2 py-5 gap-8">
        {/* Questions Column */}
        <div className="col-span-1 flex flex-col gap-5">
          {faqData.map((item, index) => (
            <div 
              key={index} 
              onClick={() => handleQuestionClick(index)} 
              className="cursor-pointer"
            >
              <p className={`font-semibold lg:text-base text-sm   ${selectedQuestion === index ? 'text-mainGreen underline' : ''}`}>
                {item.question}
              </p>
            </div>
          ))}
        </div>

        {/* Answers Column */}
        <div className="col-span-1">
          { (
            <div className="px-4 py-10 lg:py-16 bg-gray-100 border-2 border-mainGreen rounded-md">
              <p className='text-black'>{faqData[selectedQuestion].answer}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Faq;
