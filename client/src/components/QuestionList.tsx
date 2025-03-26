import { useEffect } from 'react';
import { QuestionListProps } from '../utils/types';

const QuestionList = ({ questions, refreshQuestions }: QuestionListProps) => {
  useEffect(() => {
    refreshQuestions();
  }, [refreshQuestions]);

  return (
    <div
      style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}
    >
      <div
        style={{
          background: '#f8f8f8',
          padding: '20px 30px',
          borderRadius: '10px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          width: '600px',
          textAlign: 'left',
        }}
      >
        <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>
          질문 리스트
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {Object.entries(questions || {}).map(([address, questionList]) =>
            questionList.map((question, idx) => (
              <div
                key={`${address}-${idx}`}
                style={{
                  background: '#fff',
                  padding: '15px',
                  borderRadius: '8px',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                  borderLeft: '5px solid #333',
                }}
              >
                <p style={{ margin: 0, fontWeight: 'bold' }}>{address}</p>
                <p style={{ margin: '5px 0 0 0' }}>{question}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionList;
