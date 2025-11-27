const getLangData = (langData: any[], lang: string) => {
  return langData?.find((item: any) => item.languages_code === lang) || null;
}

export { getLangData };