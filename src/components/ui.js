import '../assets/styles/base.less';

import {Confirm, Alert, Toast, Notify, Loading} from './dialog';
import {Layout} from './layout';
import {Button, ButtonGroup} from './button';
import {NavBar, NavBarBackIcon, NavBarNextIcon} from './navbar';
import {CellItem, CellGroup} from './cell';
import {Switch} from './switch';
import {GridsItem, GridsGroup} from './grids';
import {Icons} from './icons';
// import {ListTheme, ListItem, ListOther} from './list';
import {InfiniteScroll} from './infinitescroll';
import {PullRefresh} from './pullrefresh';
import {Badge, BadgeRadius} from './badge';
import {TabBar, TabBarItem} from './tabbar';
import {Tab, TabPanel} from './tab';
import {ScrollTab, ScrollTabPanel} from './scrolltab';
import {ActionSheet} from './actionsheet';
import {SendCode} from './sendcode';
// import {KeyBoard} from './keyboard';
import {Slider, SliderItem} from './slider';
import {Spinner} from './spinner';
// import {CitySelect} from './cityselect';
import {ProgressBar} from './progressbar';
import {LazyImg} from './lazyimg';
import {CountDown} from './countdown';
import {Rate} from './rate';
import {TextArea} from './textarea';
import {Popup} from './popup';
// import {CountUp} from './countup';
import {RollNotice, RollNoticeItem} from './rollnotice';

window.document.addEventListener('touchstart', function (event) {
    /* Do Nothing */
}, false);

const install = function (Vue) {
    Vue.component(Layout.name, Layout);
    Vue.component(Button.name, Button);
    Vue.component(ButtonGroup.name, ButtonGroup);
    Vue.component(NavBar.name, NavBar);
    Vue.component(NavBarBackIcon.name, NavBarBackIcon);
    Vue.component(NavBarNextIcon.name, NavBarNextIcon);
    Vue.component(CellGroup.name, CellGroup);
    Vue.component(CellItem.name, CellItem);
    Vue.component(Switch.name, Switch);
    Vue.component(GridsItem.name, GridsItem);
    Vue.component(GridsGroup.name, GridsGroup);
    Vue.component(Icons.name, Icons);
    // Vue.component(ListTheme.name, ListTheme);
    // Vue.component(ListItem.name, ListItem);
    // Vue.component(ListOther.name, ListOther);
    Vue.component(InfiniteScroll.name, InfiniteScroll);
    Vue.component(PullRefresh.name, PullRefresh);
    Vue.component(Badge.name, Badge);
    Vue.component(TabBar.name, TabBar);
    Vue.component(TabBarItem.name, TabBarItem);
    Vue.component(Tab.name, Tab);
    Vue.component(TabPanel.name, TabPanel);
    Vue.component(ScrollTab.name, ScrollTab);
    Vue.component(ScrollTabPanel.name, ScrollTabPanel);
    Vue.component(ActionSheet.name, ActionSheet);
    Vue.component(SendCode.name, SendCode);
    // Vue.component(KeyBoard.name, KeyBoard);
    Vue.component(Slider.name, Slider);
    Vue.component(SliderItem.name, SliderItem);
    Vue.component(Spinner.name, Spinner);
    // Vue.component(CitySelect.name, CitySelect);
    Vue.component(ProgressBar.name, ProgressBar);
    Vue.component(LazyImg.name, LazyImg);
    Vue.component(CountDown.name, CountDown);
    Vue.component(Rate.name, Rate);
    Vue.component(TextArea.name, TextArea);
    Vue.component(Popup.name, Popup);
    // Vue.component(CountUp.name, CountUp);
    Vue.component(RollNotice.name, RollNotice);
    Vue.component(RollNoticeItem.name, RollNoticeItem);

    Vue.prototype.$dialog = {
        confirm: Confirm,
        alert: Alert,
        toast: Toast,
        notify: Notify,
        loading: Loading,
    };
};

if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue);
}

export default {
    install
};
