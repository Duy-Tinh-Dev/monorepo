import React, { useEffect, useState } from 'react';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import SwapVertOutlinedIcon from '@mui/icons-material/SwapVertOutlined';
import { useTranslation } from '@op/i18n';
import {
  MenuOptionItem,
  MenuOptionProps,
} from '@components/view-menu-option/menu-option';
import SubMenuOption from '@components/view-menu-option/sub-menu-option';

interface SortProps extends MenuOptionProps {
  isReset: boolean;
  setIsReset: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sort: React.FC<SortProps> = ({
  filterPriority,
  groupBy,
  sortBy,
  isReset,
  onSetFilterSort,
  onSetGroup,
  onSetSort,
  setIsReset,
}) => {
  const { t } = useTranslation(['option']);

  const menuSortDefault: MenuOptionItem[] = [
    {
      icon: <ContentCopyOutlinedIcon fontSize='small' />,
      label: t('groupBy.heading'),
      type: 'group',
      selected: t('groupBy.default'),
      subMenu: [
        {
          id: 1,
          option: t('groupBy.default'),
        },
        {
          id: 2,
          option: t('groupBy.priority'),
        },
      ],
    },
    {
      icon: <SwapVertOutlinedIcon fontSize='small' />,
      label: t('sortBy.subHeading'),
      type: 'sort',
      selected: t('sortBy.default'),
      subMenu: [
        {
          id: 1,

          option: t('sortBy.default'),
        },
        {
          id: 2,
          option: t('sortBy.priority'),
        },
        { id: 3, option: t('sortBy.name') },
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

  return menuSort.map((item, index) => (
    <SubMenuOption
      key={index}
      idName={String(index)}
      icon={item.icon}
      label={item.label}
      type={item.type}
      selected={item.selected}
      subMenu={item.subMenu}
      groupBy={groupBy}
      sortBy={sortBy}
      filterPriority={filterPriority}
      onSetSort={onSetSort}
      onSetFilterSort={onSetFilterSort}
      onSetGroup={onSetGroup}
      onChangeMenu={handleChangeMenuSort}
    />
  ));
};

export default Sort;
