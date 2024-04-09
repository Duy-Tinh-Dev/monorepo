import React, { useEffect, useState } from 'react';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import SwapVertOutlinedIcon from '@mui/icons-material/SwapVertOutlined';
import { useTranslation } from '@op/i18n';
import { MenuOptionItem } from '@/components/view-menu-option/menu-option';
import SubMenuOption from '@/components/view-menu-option/sub-menu-option';
import { Direction, GroupBy, SortBy } from '../todo-list/types';
import { OptionFilter } from '@/components/todo-list/types';
import StraightIcon from '@mui/icons-material/Straight';
import SouthIcon from '@mui/icons-material/South';
import { useSelector } from 'react-redux';
import { filterSelector } from '@/redux/selectors';

interface SortProps {
  isReset: boolean;
  setIsReset: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sort: React.FC<SortProps> = ({ isReset, setIsReset }) => {
  const { t } = useTranslation(['option']);
  const { sortBy, direction } = useSelector(filterSelector);

  const iconDirection =
    direction === Direction.ASCENDING ? (
      <StraightIcon fontSize='small' />
    ) : (
      <SouthIcon fontSize='small' />
    );
  const menuSortDefault: MenuOptionItem[] = [
    {
      icon: <ContentCopyOutlinedIcon fontSize='small' />,
      label: t('groupBy.heading'),
      type: OptionFilter.GROUP,
      selected: GroupBy.DEFAULT,
      subMenu: [
        {
          id: 1,
          option: GroupBy.DEFAULT,
        },
        {
          id: 2,
          option: GroupBy.PRIORITY,
        },
        { id: 3, option: GroupBy.DATE },
      ],
    },
    {
      icon: <SwapVertOutlinedIcon fontSize='small' />,
      label: t('sortBy.subHeading'),
      type: OptionFilter.SORT,
      selected: SortBy.DEFAULT,
      subMenu: [
        {
          id: 1,
          option: SortBy.DEFAULT,
        },
        {
          id: 2,
          option: SortBy.PRIORITY,
        },
        { id: 3, option: SortBy.NAME },
      ],
    },
    {
      icon: null,
      label: t('direction.heading'),
      type: OptionFilter.DIRECTION,
      selected: Direction.ASCENDING,
      subMenu: [
        {
          id: 1,
          option: Direction.ASCENDING,
        },
        {
          id: 2,
          option: Direction.DESCENDING,
        },
      ],
    },
  ];

  const [menuSort, setMenuSort] = useState<MenuOptionItem[]>(menuSortDefault);

  const handleChangeMenuSort = (idMenu: number, idSubMenu: number) => {
    const newMenuSort = menuSort.map((item, index) => {
      if (index === idMenu) {
        return {
          ...item,
          selected: item.subMenu[idSubMenu].option,
        };
      }
      return item;
    });
    setMenuSort([...newMenuSort]);
    setIsReset(false);
  };

  useEffect(() => {
    if (isReset) {
      setMenuSort([...menuSortDefault]);
    }
  }, [isReset]);

  return menuSort
    .filter(
      (item) =>
        item.type !== OptionFilter.DIRECTION || sortBy !== SortBy.DEFAULT
    )
    .map((item, index) => (
      <SubMenuOption
        key={index}
        idName={String(index)}
        icon={item.icon ?? iconDirection}
        label={item.label}
        type={item.type}
        selected={item.selected}
        subMenu={item.subMenu}
        onChangeMenu={handleChangeMenuSort}
      />
    ));
};

export default Sort;
