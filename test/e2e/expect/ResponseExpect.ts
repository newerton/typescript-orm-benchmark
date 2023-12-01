import { CoreApiResponse } from '@core/@shared/domain/api/CoreApiResponse';
import { Nullable } from '@core/@shared/domain/type/CommonTypes';
import { TestUtil } from '@test/common/TestUtil';

export class ResponseExpect {
  public static codeAndMessage(
    response: CoreApiResponse<unknown>,
    expected: { code: number; error: string; message: string },
  ): void {
    expect(
      TestUtil.filterObject(response, ['code', 'error', 'message']),
    ).toEqual(expected);
  }

  public static data(
    options: { response: CoreApiResponse<unknown>; passFields?: string[] },
    expected: Nullable<unknown>,
  ): void {
    const toFilterObject = (object: any): unknown => {
      return options.passFields
        ? TestUtil.filterObject(object, options.passFields)
        : object;
    };

    const filteredData: unknown = Array.isArray(options.response)
      ? options.response.map((item) => toFilterObject(item))
      : toFilterObject(options.response);

    expect(filteredData).toEqual(expected);
  }
}
