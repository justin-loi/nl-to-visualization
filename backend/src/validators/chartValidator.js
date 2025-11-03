const { z } = require('zod');
const { AppError } = require('../utils/errors');

const EChartsSchema = z.object({
  series: z.array(z.any()).min(1, 'Chart must have at least one series'),
  xAxis: z.any().optional(),
  yAxis: z.any().optional(),
  title: z.any().optional(),
  tooltip: z.any().optional(),
  legend: z.any().optional(),
  type: z.string().optional(),
});

class ChartValidator {
  validate(chartConfig) {
    try {
      const data = typeof chartConfig === 'string'
        ? JSON.parse(chartConfig)
        : chartConfig;
      
      return EChartsSchema.parse(data);
    } catch (error) {
      throw new AppError(`Invalid chart configuration: ${error.message}`, 400);
    }
  }
}

module.exports = { ChartValidator };