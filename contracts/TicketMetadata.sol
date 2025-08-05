// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

/**
 * @title TicketMetadata
 * @dev Library for generating NFT metadata for event tickets
 */
library TicketMetadata {
    using Strings for uint256;
    
    struct MetadataParams {
        uint256 tokenId;
        uint256 eventId;
        string eventTitle;
        string eventDescription;
        string eventLocation;
        uint256 eventDate;
        string eventCategory;
        string eventImage;
        uint256 purchasePrice;
        uint256 purchaseDate;
        address owner;
    }
    
    /**
     * @dev Generate JSON metadata for a ticket NFT
     */
    function generateMetadata(MetadataParams memory params) internal pure returns (string memory) {
        string memory json = string(
            abi.encodePacked(
                '{"name": "',
                params.eventTitle,
                ' - Ticket #',
                params.tokenId.toString(),
                '",',
                '"description": "',
                params.eventDescription,
                '",',
                '"image": "',
                params.eventImage,
                '",',
                '"external_url": "https://your-dapp-url.com/ticket/',
                params.tokenId.toString(),
                '",',
                _generateAttributes(params),
                '}'
            )
        );
        
        return string(
            abi.encodePacked(
                "data:application/json;base64,",
                Base64.encode(bytes(json))
            )
        );
    }
    
    /**
     * @dev Generate attributes array for metadata
     */
    function _generateAttributes(MetadataParams memory params) private pure returns (string memory) {
        return string(
            abi.encodePacked(
                '"attributes": [',
                '{"trait_type": "Event ID", "value": "',
                params.eventId.toString(),
                '"},',
                '{"trait_type": "Event Title", "value": "',
                params.eventTitle,
                '"},',
                '{"trait_type": "Location", "value": "',
                params.eventLocation,
                '"},',
                '{"trait_type": "Category", "value": "',
                params.eventCategory,
                '"},',
                '{"trait_type": "Event Date", "display_type": "date", "value": ',
                params.eventDate.toString(),
                '},',
                '{"trait_type": "Purchase Price", "display_type": "number", "value": ',
                params.purchasePrice.toString(),
                '},',
                '{"trait_type": "Purchase Date", "display_type": "date", "value": ',
                params.purchaseDate.toString(),
                '},',
                '{"trait_type": "Token ID", "display_type": "number", "value": ',
                params.tokenId.toString(),
                '}]'
            )
        );
    }
    
    /**
     * @dev Generate SVG image for ticket (optional, for on-chain images)
     */
    function generateTicketSVG(MetadataParams memory params) internal pure returns (string memory) {
        return string(
            abi.encodePacked(
                '<svg width="400" height="600" xmlns="http://www.w3.org/2000/svg">',
                '<defs>',
                '<linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">',
                '<stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />',
                '<stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />',
                '</linearGradient>',
                '</defs>',
                '<rect width="400" height="600" fill="url(#grad1)" rx="20"/>',
                '<text x="200" y="50" text-anchor="middle" fill="white" font-size="24" font-weight="bold">EVENT TICKET</text>',
                '<text x="200" y="100" text-anchor="middle" fill="white" font-size="18">',
                _truncateString(params.eventTitle, 20),
                '</text>',
                '<text x="200" y="140" text-anchor="middle" fill="white" font-size="14">',
                _truncateString(params.eventLocation, 25),
                '</text>',
                '<text x="200" y="180" text-anchor="middle" fill="white" font-size="14">Token ID: #',
                params.tokenId.toString(),
                '</text>',
                '<rect x="50" y="220" width="300" height="2" fill="white" opacity="0.5"/>',
                '<text x="200" y="260" text-anchor="middle" fill="white" font-size="12">Category: ',
                params.eventCategory,
                '</text>',
                '<text x="200" y="290" text-anchor="middle" fill="white" font-size="12">Price: ',
                params.purchasePrice.toString(),
                ' ETH</text>',
                '<rect x="50" y="320" width="300" height="2" fill="white" opacity="0.5"/>',
                '<text x="200" y="360" text-anchor="middle" fill="white" font-size="10" opacity="0.8">Powered by Web3 Ticketing</text>',
                '</svg>'
            )
        );
    }
    
    /**
     * @dev Truncate string to specified length
     */
    function _truncateString(string memory str, uint256 maxLength) private pure returns (string memory) {
        bytes memory strBytes = bytes(str);
        if (strBytes.length <= maxLength) {
            return str;
        }
        
        bytes memory truncated = new bytes(maxLength - 3);
        for (uint256 i = 0; i < maxLength - 3; i++) {
            truncated[i] = strBytes[i];
        }
        
        return string(abi.encodePacked(truncated, "..."));
    }
}
