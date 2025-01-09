export default createHigherOrderComponent( ( OriginalComponent ) => {
    return class WrappedBlockEdit extends Component {
        constructor() {
            super( ...arguments );
            this.state = {
                selectAnimation: [],
            }

            this.createNotice = this.createNotice.bind( this );
            this.createErrorNotice = this.createErrorNotice.bind( this );
            this.removeNotice = this.removeNotice.bind( this );
            this.removeAllNotices = this.removeAllNotices.bind( this );

            this.state = {
                noticeList: [],
            };

            this.noticeOperations = {
                createNotice: this.createNotice,
                createErrorNotice: this.createErrorNotice,
                removeAllNotices: this.removeAllNotices,
                removeNotice: this.removeNotice,
            };
        }

        render() {
            return (
                <OriginalComponent
                    noticeList={ this.state.noticeList }
                    noticeOperations={ this.noticeOperations }
                    noticeUI={
                        this.state.noticeList.length > 0 && <NoticeList
                            className="components-with-notices-ui"
                            notices={ this.state.noticeList }
                            onRemove={ this.removeNotice }
                        />
                    }
                    { ...this.props }
                />
            );
        }
    };
} );