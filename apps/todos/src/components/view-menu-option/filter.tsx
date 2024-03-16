import React, { useEffect, useState } from 'react';
import { MenuOptionItem } from '@/components/view-menu-option/menu-option';
import { useTranslation } from '@op/i18n';
import FlagOutlinedIcon from '@mui/icons-material/FlagOutlined';
import SubMenuOption from '@/components/view-menu-option/sub-menu-option';

interface FilterProps {
  isReset: boolean;
  setIsReset: React.Dispatch<React.SetStateAction<boolean>>;
}

const Filter: React.FC<FilterProps> = ({ isReset, setIsReset }) => {
  const { t } = useTranslation(['option']);
  const menuFilterDefault: MenuOptionItem[] = [
    {
      icon: <FlagOutlinedIcon fontSize='small' />,
      label: t('filterBy.priority.heading'),
      type: 'priority',
      selected: t('filterBy.priority.default'),
      subMenu: [
        {
          id: 1,
          option: t('filterBy.priority.default'),
        },
        {
          id: 2,
          option: t('filterBy.priority.p1'),
        },
        {
          id: 3,
          option: t('filterBy.priority.p2'),
        },
        {
          id: 4,
          option: t('filterBy.priority.p3'),
        },
      ],
    },
  ];
  const [menuFilter, setMenuFilter] =
    useState<MenuOptionItem[]>(menuFilterDefault);

  const handleChangeMenuFilter = (idMenu: number, idSubMenu: number) => {
    const newMenuFilter = menuFilter.map((item, index) => {
      if (index === idMenu) {
        return {
          ...item,
          selected: item.subMenu[idSubMenu].option,
        };
      }
      return item;
    });
    setMenuFilter([...newMenuFilter]);
    setIsReset(false);
  };

  useEffect(() => {
    if (isReset) {
      setMenuFilter([...menuFilterDefault]);
    }
  }, [isReset]);

  return menuFilter.map((item, index) => (
    <SubMenuOption
      key={index}
      idName={String(index)}
      icon={item.icon}
      label={item.label}
      type={item.type}
      selected={item.selected}
      subMenu={item.subMenu}
      onChangeMenu={handleChangeMenuFilter}
    />
  ));
};

export default Filter;
