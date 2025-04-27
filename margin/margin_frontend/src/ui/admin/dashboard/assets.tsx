import isEmpty from 'lodash/isEmpty';
import Chart from '../../core/chart';
import { COLORS } from '../../../constants/chart.constant';
import { Card } from '../../core/card';

type AssetsProps = {
  className?: string;
  data?: any;
};

const Assets = ({ data = {}, className }: AssetsProps) => {
  return (
    <Card className={className}>
      <h4>Assets</h4>
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4'>
        {!isEmpty(data) && (
          <>
            <Chart
              donutTitle={`$${data.values?.reduce(
                (a: number, b: number) => a + b,
                0
              )}`}
              donutText='Assets'
              series={data.values}
              customOptions={{ labels: data.labels }}
              type='donut'
              height={230}
            />

            <div>
              {data.values?.length === data.coinValues?.length && (
                <div className='mt-6'>
                  {data.values?.map((value: number, index: number) => (
                    <div key={index} className='flex justify-between mb-6'>
                      <div key={value} className='flex gap-1'>
                        <div
                          className={`my-auto h-2.5 w-2.5 rounded-full  `}
                          style={{ backgroundColor: COLORS[index] }}
                        />
                        <div>
                          <h6 className='font-bold text-sm'>
                            {data.labels?.[index]}
                          </h6>
                          <p>
                            {data.coinValues?.[index]}{' '}
                            {data.coinSymbol?.[index]}
                          </p>
                        </div>
                      </div>
                      <span className='font-semibold self-end'>${value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </Card>
  );
};

export default Assets;
