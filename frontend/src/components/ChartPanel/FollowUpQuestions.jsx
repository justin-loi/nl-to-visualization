import { Box, Button, Typography } from '@mui/material';
import { QuestionAnswer } from '@mui/icons-material';

const FollowUpQuestions = ({ questions, onQuestionClick }) => {
  if (!questions || questions.length === 0) return null;

  return (
    <Box sx={{ mt: 2, p: 2, bgcolor: 'action.hover', borderRadius: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
        <QuestionAnswer sx={{ fontSize: 20, color: 'primary.main' }} />
        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
          Follow-up Questions
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {questions.map((question, index) => (
          <Button
            key={index}
            variant="outlined"
            size="small"
            onClick={() => onQuestionClick(question)}
            sx={{
              justifyContent: 'flex-start',
              textAlign: 'left',
              textTransform: 'none',
              borderRadius: 1.5,
            }}
          >
            {question}
          </Button>
        ))}
      </Box>
    </Box>
  );
};

export default FollowUpQuestions;