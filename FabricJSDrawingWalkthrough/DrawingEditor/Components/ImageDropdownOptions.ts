class ImageDropdownOptions {
    selectedStyle: ImageDropdownStyle;
    width: number;
    childWidth?: number;
    selectedIndex: any;
    optionsList: ImageOption[];
    handlers?: { [key: string]: (value?: any) => void }
}