import { stockData, optionDefaultData, OptionResult } from '../../types/option';
import * as cheerio from 'cheerio';

export const getCafe24OptionNames = (html: string): string[] => {
  const SEARCH_TEXT = "var option_name_mapper = '";
  const start = html.indexOf(SEARCH_TEXT) + SEARCH_TEXT.length;
  const end = html.indexOf("';", start);
  return html.slice(start, end).split('#$%');
};

export const getCafe24Data = (html: string) => {
  try {
    const stockData = getStockData(html);

    if (Object.values(stockData)[0]['use_stock']) {
      return stockData;
    }
    return getOptionDefaultData(html);
  } catch {
    return getOptionDefaultData(html);
  }
};

const getStockData = (html: string) => {
  const SEARCH_TEXT = "option_stock_data = '";
  const start = html.indexOf(SEARCH_TEXT) + SEARCH_TEXT.length;
  const end = html.indexOf("';var", start);
  const optionDataStr = html
    .slice(start, end)
    .replace(/\\\"/gi, '"')
    .replace(/\\\\/gi, '\\');

  return JSON.parse(optionDataStr);
};

// @TODO optionDefaultData 긁는 로직 완성하기
const getOptionDefaultData = (html: string) => {
  const data = {};
  const $ = cheerio.load(html);
  $('select.ProductOption0').each((index, ele) => {
    data[index] = $(ele).html();
  });

  const optionPriceVariants = {};
  const stockData = getStockData(html);
  Object.keys(stockData).forEach((key) => {
    const stock_price = Number(stockData[key].stock_price);
    if (stock_price !== 0) optionPriceVariants[key] = stock_price;
  });
  data['optionPriceVariants'] = optionPriceVariants;

  return data;
};

export const formatCafe24Data = (data, optionNames: string[]) => {
  if (data['optionPriceVariants'] !== undefined) {
    return formatOptionDefaultData(data, optionNames);
  }
  return formatStockData(data, optionNames);
};

const formatOptionDefaultData = (
  data: optionDefaultData,
  optionNames: string[]
) => {
  const option: OptionResult = {
    values: {},
    isSoldOut: [],
    optionPriceVariants: [],
    productPriceVariants: [],
  };

  const optionPriceVariants = data.optionPriceVariants;
  const optionPriceVariantsKeys = Object.keys(optionPriceVariants);
  delete data.optionPriceVariants;

  Object.values(data).forEach((value, index) => {
    option.values[optionNames[index]] = [];
    const $ = cheerio.load(value);
    $('body')
      .children()
      .each((i, ele) => {
        if (i >= 2) {
          option.values[optionNames[index]].push(ele.children[0].data);
          if (optionPriceVariantsKeys.includes(ele.attribs.value)) {
            option.optionPriceVariants.push({
              option: [index, i - 2],
              price: optionPriceVariants[ele.attribs.value],
            });
          }
        }
      });
  });

  const optionValuesArr = Object.values(option.values);
  const divisorArr = optionValuesArr.map((e) => e.length).reverse();
  const mul = divisorArr.reduce((acc, curr) => acc * curr, 1);
  const optionVariants = Array.apply(null, Array(mul)).map((_, index) => {
    let bf = index;
    let optionVariant = [];
    divisorArr.forEach((divisor) => {
      optionVariant.unshift(Math.floor(bf % divisor));
      bf = Math.floor(bf / divisor);
    });
    return optionVariant;
  });

  optionVariants.forEach((optionVariant) => {
    const totalPrice = option.optionPriceVariants.reduce(
      (acc, optionPriceVariant) => {
        const { option, price } = optionPriceVariant;
        return optionVariant[option[0]] === option[1] ? acc + price : acc;
      },
      0
    );
    if (totalPrice > 0)
      option.productPriceVariants.push({
        option: optionVariant,
        price: totalPrice,
      });
  });

  return option;
};

const formatStockData = (data: stockData | boolean, optionNames: string[]) => {
  const option: OptionResult = {
    values: {},
    isSoldOut: [],
    optionPriceVariants: [],
    productPriceVariants: [],
  };

  if (optionNames.length !== 0) {
    Object.values(data).forEach((item) => {
      const values = item.option_value_orginal;
      optionNames.forEach((optionName, index) => {
        option.values[optionName] = [
          ...new Set(option.values[optionName]).add(values[index]),
        ];
      });
      if (
        item.is_selling === 'F' ||
        (item.is_auto_soldout === 'T' && item.stock_number === 0)
      ) {
        option.isSoldOut.push(
          values.map((value, index) =>
            option.values[optionNames[index]].indexOf(value)
          )
        );
      }
    });

    const optionValuesArr = Object.values(option.values);
    const optionPriceVariants = Object.values(data).map((item) => {
      const result = {
        option: item.option_value_orginal.map((value, i) =>
          optionValuesArr[i].indexOf(value)
        ),
        price: Number(item.stock_price),
      };
      if (Number(item.stock_price) > 0)
        option.productPriceVariants.push(result);
      return result;
    });

    const optionValuesLengthArr = optionValuesArr.map((e) => e.length);
    optionValuesLengthArr.map((length, index) => {
      const prices = Array.apply(null, Array(length)).map((_, num) => {
        const option = optionValuesArr.map((_, i) => (index === i ? num : 0));
        const { price } = optionPriceVariants.find(
          (e) => JSON.stringify(e.option) === JSON.stringify(option)
        );
        return price;
      });
      const minPrice = Math.min(...prices);
      prices.forEach((price, i) => {
        if (price > minPrice)
          option.optionPriceVariants.push({
            option: [index, i],
            price: price - minPrice,
          });
      });
    });
  } else option['itemIsSoldOut'] = !!data;

  return option;
};
